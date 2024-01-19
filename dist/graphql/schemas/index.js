"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
module.exports = (0, graphql_1.buildSchema)(`
    # ---------------------- 🆕 Types -----------------------------------------------
    type loginCreds {
        _id:ID!
        valid:Boolean!
        token:String
    }
    type Complaint {
        _id:ID!
        date_of_submit:String!
        seen:Boolean
        from:String!
        department:String!
        content:String!
        location:String!
        under_review:Boolean
        processed:Boolean
        image:[String]
    }
    type Department {
        _id:ID!
        name:String!
    }
    type Meeting {
        _id:ID!
        date_of_submit:String
        seen:Boolean
        from:String
        date:String
        slot:String
        overview:String
        confirm:Boolean
        cancel:Boolean
        reason_to_cancel:String!
    }
    type Note {
        _id:ID
        content:String
    }
    type Notice {
        _id:ID!
        announcement_date:String!
        content:String!
    }
    type Report {
        _id:ID!
        date_of_submit:String!
        seen:Boolean
        from:String!
        content:String!
        location:String!
        under_review:Boolean
        processed:Boolean
        image:[String]
    }
    type Slot {
        _id:ID!
        district:String!
        slot1:String!
        slot2:String!
    }
    type Success {
        _id:ID!
        publish_date:String!
        content:String!
        image:[String]
    }
    type CitizenLogin{
        _id:ID!
        email:String!
        complaints:[Complaint]
        reports:[Report]
        meeting:ID
        token:String!
    }
    # ---------------------- 🔡 Inputs -----------------------------------------------
    input NewComplaint {
        from:String!
        department:String!
        content:String!
        location:String!
        image:[String]
    }
    input NewDepartment {
        name:String!
    }
    input NewMeeting {
        from:String!
        date:String!
        slot:String!
        overview:String!
    }
    input NewNote {
        content:String!
    }
    input NewNotice {
        content:String!
    }
    input NewReport {
        from:String!
        content:String!
        location:String!
        image:[String]
    }
    input NewSlot {
        district:String!
        slot1:String!
        slot2:String!
    }
    input NewSuccess {
        content:String!
        image:[String]
    }


    # ----------------------USER Types-----------------------------------------------
    # ----------------------USER Inputs-----------------------------------------------

    type RootQuery {
    # ----------------------COLLECTOR Queries-----------------------------------------------
        login(email:String!,password:String!):loginCreds!
        meetings:[Meeting]
        notes:[Note]
        complaints:[Complaint]
        reports:[Report]
        notices:[Notice]
        stories:[Success]
    # ----------------------CITIZEN Queries-----------------------------------------------
        loginCitizen(email:String!,password:String!):CitizenLogin!
    }

    type RootMutation {
    # ----------------------COLLECTOR Mutations-----------------------------------------------
        saveNote(note:NewNote):Note!
        deleteNote(id:String):Note!
        publishNotice(content:String!):Notice
        publishStory(story:NewSuccess):Success

    # ----------------------CITIZEN Mutations-----------------------------------------------

        sendOtp(email:String!):String!
        verifyOtp(otp:String!,enc:String!):Boolean!
        register(email:String!,password:String!):Boolean!
    }
     schema {
        query:RootQuery
        mutation:RootMutation
    }    
`);
