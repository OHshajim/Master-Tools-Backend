import mongoose from "mongoose";

import Plans from "../models/Plans.js";
import Orders from "../models/Orders.js";
import Notification from "../models/Notification.js";
import Credential from "../models/Credential.js";
import Cookies from "../models/Cookie.js";
import DraftPlatform from "../models/DraftPlatform.js";


 export function watchCollections(io) {
     // ----------------------
     // Plans
     // ----------------------
     if (mongoose.connection.readyState !== 1) {
         console.log("MongoDB not connected yet, cannot watch collections.");
         return;
     }
     console.log("MongoDB connected, starting Change Streams...");

     try {
         Plans.watch().on("change", (change) => {
             io.emit("planUpdated", {
                 type: change.operationType,
                 document: change.fullDocument,
                 documentKey: change.documentKey,
             });
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }

     // ----------------------
     // Orders
     // ----------------------
     try {
         Orders.watch().on("change", (change) => {
             io.emit("orderUpdated", {
                 type: change.operationType,
                 document: change.fullDocument,
                 documentKey: change.documentKey,
             });
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }

     // ----------------------
     // Notifications
     // ----------------------
     try {
         Notification.watch().on("change", (change) => {
             io.emit("notifications", {
                 type: change.operationType,
                 document: change.fullDocument,
                 documentKey: change.documentKey,
             });
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }

     // ----------------------
     // Credentials
     // ----------------------
     try {
         Credential.watch().on("change", (change) => {
            io.emit("credential");
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }

     // ----------------------
     // Cookies
     // ----------------------
     try {
         Cookies.watch().on("change", (change) => {
            io.emit("cookie");
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }

     // ----------------------
     // Cookies
     // ----------------------
     try {
         DraftPlatform.watch().on("change", (change) => {
            io.emit("draftPlatform");
         });
     } catch (err) {
         console.warn(
             "Change streams not available. Replica set required.",
             err.message
         );
     }
 }
