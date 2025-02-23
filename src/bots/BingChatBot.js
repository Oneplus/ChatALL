import Bot from "./Bot";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import WebSocketAsPromised from "websocket-as-promised";

function randomIP() {
  return (
    "13." +
    Math.floor(Math.random() * 3 + 105) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255)
  );
}
export default class BingChatBot extends Bot {
  static _brandId = "bingChat";
  static _className = "BingChatBot"; // Class name of the bot
  static _model = "h3precise"; // Bing styles: h3imaginative, harmonyv3, h3precise
  static _logoFilename = "bing-logo.svg"; // Place it in assets/bots/
  static _loginUrl = "https://www.bing.com/new";
  static _userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48";

  static _conversation = null;

  constructor() {
    super();
  }

  async createConversation() {
    const headers = {
      "x-ms-client-request-id": uuidv4(),
      "x-ms-useragent":
        "azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32",
      "x-forwarded-for": randomIP(),
    };
    var conversation = null;

    try {
      const response = await axios.get(
        "https://www.bing.com/turing/conversation/create",
        { headers }
      );
      if (response.data && response.data.result.value == "Success") {
        // Save the conversation context
        conversation = {
          clientId: response.data.clientId,
          conversationId: response.data.conversationId,
          conversationSignature: response.data.conversationSignature,
          invocationId: 0,
        };
      } else {
        console.error("Error creating Bing Chat conversation:", response);
      }
    } catch (error) {
      console.error("Error creating Bing Chat conversation:", error);
    }

    return conversation;
  }

  async checkAvailability() {
    // Bing Chat does not have a login status API
    // So we just check if we can create a conversation
    const conversation = await this.createConversation();
    this.constructor._isAvailable = !!conversation;
    if (this.constructor._conversation === null) {
      this.constructor._conversation = conversation;
    }
    return this.isAvailable();
  }

  buildChatRequest(prompt) {
    return {
      arguments: [
        {
          source: "cib",
          optionsSets: [
            "nlu_direct_response_filter",
            "deepleo",
            "disable_emoji_spoken_text",
            "responsible_ai_policy_235",
            "enablemm",
            this.constructor._model,
            "responseos",
            "nourldedupe",
            "healthansgnd",
            "dv3sugg",
            "clgalileo",
            "gencontentv3",
          ],
          allowedMessageTypes: ["Chat", "InternalSearchQuery"],
          isStartOfSession: this.constructor._conversation.invocationId === 0,
          message: {
            timestamp: new Date().toISOString(),
            author: "user",
            inputMethod: "Keyboard",
            text: prompt,
            messageType: "Chat",
          },
          conversationSignature:
            this.constructor._conversation.conversationSignature,
          conversationId: this.constructor._conversation.conversationId,
          participant: { id: this.constructor._conversation.clientId },
        },
      ],
      invocationId: this.constructor._conversation.invocationId.toString(),
      target: "chat",
      type: 4,
    };
  }

  async _sendPrompt(prompt, onUpdateResponse, callbackParam) {
    return new Promise((resolve, reject) => {
      try {
        const RecordSeparator = String.fromCharCode(30);
        const wsp = new WebSocketAsPromised(
          "wss://sydney.bing.com/sydney/ChatHub",
          {
            packMessage: (data) => {
              return JSON.stringify(data) + RecordSeparator;
            },
            unpackMessage: (data) => {
              return data
                .toString()
                .split(RecordSeparator)
                .filter(Boolean)
                .map((d) => JSON.parse(d));
            },
          }
        );

        wsp.onOpen.addListener(() => {
          wsp.sendPacked({ protocol: "json", version: 1 });
        });

        wsp.onUnpackedMessage.addListener(async (events) => {
          for (const event of events) {
            if (JSON.stringify(event) === "{}") {
              wsp.sendPacked({ type: 6 });
              wsp.sendPacked(this.buildChatRequest(prompt));
              this.constructor._conversation.invocationId += 1;
            } else if (event.type === 6) {
              wsp.sendPacked({ type: 6 });
            } else if (event.type === 3) {
              onUpdateResponse(null, callbackParam, true);
              wsp.removeAllListeners();
              wsp.close();
              resolve();
            } else if (event.type === 2) {
              if (event.item.result.value !== "Success") {
                console.error("Error sending prompt to Bing Chat:", event);
                reject(event.item.result.message);
              } else if (
                event.item.throttling.maxNumUserMessagesInConversation ===
                event.item.throttling.numUserMessagesInConversation
              ) {
                // Max number of messages reached
                this.constructor._conversation =
                  await this.createConversation();
              }
              wsp.removeAllListeners();
              wsp.close();
              resolve();
            } else if (event.type === 1) {
              if (event.arguments[0].messages?.length > 0) {
                const response = event.arguments[0].messages[0].text;
                onUpdateResponse(response, callbackParam, false);
              }
            }
          }
        });

        wsp.open();
      } catch (error) {
        reject(error);
      }
    });
  }
}
