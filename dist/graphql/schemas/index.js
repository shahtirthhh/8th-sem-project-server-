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
        date_of_submit:String
        seen:Boolean
        from:String
        department:String
        content:String
        location:String
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
        date_of_submit:String!
        seen:Boolean!
        from:String!
        date:String!
        slot:String!
        overview:String!
        confirm:Boolean!
        cancel:Boolean!
        reason_to_cancel:String
        happen: Boolean!
        reason_to_not_happen:String!
        missed:Boolean
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
        _id:ID
        date_of_submit:String
        seen:Boolean
        from:String
        content:String
        location:String
        under_review:Boolean
        processed:Boolean
        image:[String]
    }
    type OneSlotData{
        name:String
        time:String
    }
    type OneSlot{
        date:String
        slot:OneSlotData
    }
    type Slot {
        _id:ID!
        district:String!
        slots:[OneSlot]
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
    type citizenMeetings{
        meeting:Meeting
        meetings:[Meeting]
    }
    type Citizen{
        _id:ID
        email:String
        complaints:[Complaint]
        reports:[Report]
        meetings:[Meeting]
        meeting:ID
    }
    # ---------------------- 🔡 Inputs -----------------------------------------------
    input InputMeeting {
        _id:ID
        date_of_submit:String
        seen:Boolean
        from:String
        date:String
        slot:String
        overview:String
        confirm:Boolean
        cancel:Boolean
        reason_to_cancel:String
        happen: Boolean
        reason_to_not_happen:String
        missed:Boolean
    }
    input InputReport {
        _id:ID
        date_of_submit:String
        seen:Boolean
        from:String
        content:String
        location:String
        under_review:Boolean
        processed:Boolean
        image:[String]
    }
    input InputComplaint {
        _id:ID
        date_of_submit:String
        seen:Boolean
        from:String
        department:String
        content:String
        location:String
        under_review:Boolean
        processed:Boolean
        image:[String]
    }
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
    input InputNotifications {
        meetings:[InputMeeting]!
        reports:[InputReport]!
        complaints:[InputComplaint]!
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
        citizens:[Citizen]
    # ----------------------CITIZEN Queries-----------------------------------------------
        loginCitizen(email:String!,password:String!):CitizenLogin!
        myMeeting:citizenMeetings
        getFreeSlots:[OneSlot]
        getCollectorSocket:String
        myComplaints:[Complaint]!
        myReports:[Report]!
    }

    type RootMutation {
    # ----------------------COLLECTOR Mutations-----------------------------------------------
        saveNote(note:NewNote):Note!
        deleteNote(id:String):Note!
        publishNotice(content:String!):Notice
        publishStory(story:NewSuccess):Success
        cancelMeeting(id:String,reason_to_cancel:String):Boolean
        confirmMeeting(id:String):Boolean
        changeStatus(status:Boolean!,socket:String!):Boolean!
        setMeetingAsHappened(meetingId:String!):Boolean!
        setAsUnderReview(complaintId:String!):Boolean!
        setAsProcessed(complaintId:String!):Boolean!
        setAsUnderReviewReport(reportId:String!):Boolean!
        setAsProcessedReport(reportId:String!):Boolean!

    # ----------------------CITIZEN Mutations-----------------------------------------------

        sendOtp(email:String!):String!
        verifyOtp(otp:String!,enc:String!):Boolean!
        register(email:String!,password:String!):Boolean!
        requestMeeting(date:String!,slot:String!,overview:String!):Boolean!
        setNotificationsAsSeen(meetings:[InputMeeting],complaints:[InputComplaint],reports:[InputReport]):Boolean!
        missedMyMeeting(meetingId:String!):Boolean!
        newComplaint(content:String!,location:String!,department:String!,image:[String]):String!
        newReport(content:String!,location:String!,image:[String]):String!

    }
     schema {
        query:RootQuery
        mutation:RootMutation
    }    
`);
