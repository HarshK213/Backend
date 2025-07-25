import mongoose from "mongoose";
import { User } from "./user.models";

const subscriptionSchema = new mongoose.Schema(
     {
          subscriber : {
               type : mongoose.Schema.Types.ObjectId,
               ref : User,
          },
          channel : {
               type : mongoose.Schema.Types.ObjectId,
               ref : User,
          }
     },
     {
          timestamps : true,
     }
)

export const Subscription = new mongoose.model("Subscription", subscriptionSchema);