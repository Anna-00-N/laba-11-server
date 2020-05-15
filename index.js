const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const { createStore } = require("./utils");
const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");
const resolvers = require("./resolvers");
const isEmail = require("isemail");
const store = createStore();

const port = process.env.PORT || 4000;

const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    console.log(stripe);
    const auth = (req.headers && req.headers.authorization) || "";
    const email = Buffer.from(auth, "base64").toString("ascii");
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })
  }),
  resolvers,
  introspection: true,
  playground: true
});

server.listen(port, () => {
  //alert(stripe);
  /*
  let intent = stripe.paymentIntents
    .create({
      amount: 1,
      payment_method: stripe,
      confirm: true,
      error_on_requires_action: true,
      currency: "eur",
      payment_method_types: ["card"]
    })
    .then(paymentIntentResponse => {
      console.log(paymentIntentResponse + "!");
    });*/
  console.log("Listening on port:" + String(port));
});
