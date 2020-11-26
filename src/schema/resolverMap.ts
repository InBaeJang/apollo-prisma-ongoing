import { IResolvers } from 'graphql-tools';
import Query from '../resolvers/Query';
import Mutation from '../resolvers/Mutation'
import User from '../resolvers/User'
import Link from '../resolvers/Link'
import Subscription from '../resolvers/Subscription'
import Vote from '../resolvers/Vote'

const resolverMap: IResolvers = {
    Query,
    Mutation,
    User,
    Link,
    Subscription,
    Vote
};

export default resolverMap;