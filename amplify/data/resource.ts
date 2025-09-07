import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates multiple database tables with relationships for 
managing people, meetings, attendance, and roles in a church (or similar) context.
=========================================================================*/

const schema = a.schema({
  AttendanceStatus: a.enum(['PRESENT', 'LATE', 'EXCUSED', 'ABSENT']),
  MeetingRoleType: a.enum(['SPEAKER', 'SHARER', 'WORSHIP_LEADER', 'MODERATOR', 'OTHER']),
  
  Person: a
    .model({
      fullName: a.string().required(),
      address: a.string().required(),
      whatsappE164: a.string().required(),
      notes: a.string(),
      tags: a.hasMany('PersonTag', 'personID'),
      attendances: a.hasMany('Attendance', 'personID'),
      roles: a.hasMany('MeetingRole', 'personID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  Meeting: a
    .model({
      meetingDate: a.date().required(),
      messageTitle: a.string(),
      notes: a.string(),
      tags: a.hasMany('MeetingTag', 'meetingID'),
      attendances: a.hasMany('Attendance', 'meetingID'),
      roles: a.hasMany('MeetingRole', 'meetingID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  Attendance: a
    .model({
      status: a.ref('AttendanceStatus'),
      checkInAt: a.datetime(),
      checkInBy: a.string(),
      remarks: a.string(),
      personID: a.id().required(),
      meetingID: a.id().required(),
      person: a.belongsTo('Person', 'personID'),
      meeting: a.belongsTo('Meeting', 'meetingID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  MeetingRole: a
    .model({
      roleType: a.ref('MeetingRoleType'),
      details: a.string(),
      personID: a.id().required(),
      meetingID: a.id().required(),
      person: a.belongsTo('Person', 'personID'),
      meeting: a.belongsTo('Meeting', 'meetingID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  Tag: a
    .model({
      name: a.string().required(),
      tagType: a.string(),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  PersonTag: a
    .model({
      assignedAt: a.datetime(),
      personID: a.id().required(),
      tagID: a.id().required(),
      person: a.belongsTo('Person', 'personID'),
      tag: a.belongsTo('Tag', 'tagID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
  
  MeetingTag: a
    .model({
      assignedAt: a.datetime(),
      meetingID: a.id().required(),
      tagID: a.id().required(),
      meeting: a.belongsTo('Meeting', 'meetingID'),
      tag: a.belongsTo('Tag', 'tagID'),
    })
    .authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
