const { gql } = require("apollo-server");

const typeDefs = gql`
  type Rocket {
    id: ID!
    name: String
    type: String
  }
  type Mission {
    name: String
    missionPatch(mission: String, size: PatchSize): String
  }
  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }
  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }
  enum PatchSize {
    SMALL
    LARGE
  }
  type Query {
    launches(pageSize: Int, after: String): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }
  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
  }
`;

module.exports = typeDefs;
