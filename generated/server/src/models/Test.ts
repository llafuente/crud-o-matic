import mongoose = require("mongoose");
import { ITest } from "./ITest";
export * from "./ITest";

export interface ITestModel extends ITest, mongoose.Document {}

export const TestSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      maxlength: 255,
    },

    instructions: {
      type: String,
    },

    randomizeAnwers: {
      type: Boolean,
    },

    blocks: {
      type: Array,
      items: {
        type: Object,
        properties: {
          name: {
            type: String,
            default: null,
            maxlength: 255,
          },
          questions: {
            type: Array,
            items: {
              type: Object,
              properties: {
                questions: {
                  type: String,
                  default: null,
                },
                answers: {
                  type: Array,
                  items: {
                    type: String,
                    default: null,
                  },
                  default: [],
                },
                correcAnswerIndex: {
                  type: Number,
                  default: null,
                },
              },
              default: null,
            },
            default: [],
          },
        },
        default: null,
      },
      default: [],
    },

    maxTime: {
      type: Number,
    },

    usersSubscribed: {
      type: Number,
    },

    usersDone: {
      type: Number,
    },
  },
  {
    collection: "tests",
  },
);

export const Test = mongoose.model<ITestModel>("Test", TestSchema);
