// import WebSocketAsPromised from "websocket-as-promised";
// import axios from "axios";
import AsyncLock from "async-lock";

import Bot from "./Bot";
import store from "@/store";
import {SSE} from "sse.js";
// import i18n from "@/i18n";

export default class AzureAPIBot extends Bot {
  static _brandId = "azureApi";
  static _className = "AzureAPIBot";
  static _logoFilename = "azure-api-logo.svg";
  static _loginUrl = "";
  static _lock = new AsyncLock();

  static _chat_id = 0;

  constructor() {
    super();
  }

  getHeader() {
    return {
      "Content-Type": "application/json",
      "api-key": `${store.state.azureApiKey}`,
    };
  }

  async checkAvailability() {
    if (!store.state.azureApiKey) {
      this.constructor._isAvailable = false;
    } else {
      this.constructor._isAvailable = true;
    }
    return this.isAvailable();
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    try {
      const headers = this.getHeader();
      const apiUrl = `${store.state.azureApiEndpoint}openai/deployments/${store.state.azureApiEngine}/chat/completions?api-version=2023-03-15-preview`
      const payload = JSON.stringify({
        messages: [{
          role: "system", content: "You are a helpful assistant."
        }, {
          role: "user", content: `${prompt}`
        }],
        temperature: 0.9,
        stream: true,
      });

      const requestConfig = {
        headers,
        method: "POST",
        payload,
      };

      let res = "";
      return new Promise((resolve, reject) => {
        // call OpenAI API
        const source = new SSE(apiUrl, requestConfig);

        source.addEventListener("message", (event) => {
          const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/;
          if (event.data === "[DONE]") {
            onUpdateResponse(null, callbackParam, true);
            source.close();
            resolve();
          } else if (regex.test(event.data)) {
            // Ignore the timestamp
            return;
          } else {
            const data = JSON.parse(event.data);
            const partialText = data.choices?.[0]?.delta?.content;
            if (!partialText) {
              console.warn("No partial text in ChatGPT response:", data);
              return;
            }
            res += partialText;
            onUpdateResponse(res, callbackParam);
          }
        });
        source.addEventListener("error", (error) => {
          const data = JSON.parse(error.data);
          source.close();
          console.error("Request error: ", error);
          reject(data.error.message);
        });
        source.addEventListener("done", () => {
          source.close();
          resolve();
        });
        source.stream();
      });
    } catch (error) {
      console.error("Error sending prompt to AzureApi: ", error);
    }
  }
}