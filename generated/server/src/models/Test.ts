import mongoose = require("mongoose");
import { ITest } from './ITest';
export * from './ITest';
import { pbkdf2Sync, randomBytes} from 'crypto';


export interface ITestModel extends ITest, mongoose.Document { }

export const TestSchema = new mongoose.Schema({
  label:{
type: String,
maxlength: 255
},
instructions:{
type: String
},
randomizeAnwers:{
type: Boolean
},
blocks:{
type: Array,
items: {
type: Object,
properties: {name:{
type: String,
maxlength: 255
},
questions:{
type: Array,
items: {
type: Object,
properties: {questionLabel:{
type: String
},
answers:{
type: Array,
items: {
type: Object,
properties: {answerLabel:{
type: String
}}
},
default: []
},
correcAnswerIndex:{
type: Number
}}
},
default: []
}}
},
default: []
},
maxTime:{
type: Number
},
usersSubscribed:{
type: Number
},
usersDone:{
type: Number
}
}, {
  "collection": "tests"
});




export const Test = mongoose.model<ITestModel>("Test", TestSchema);
