import { config } from '@keystone-6/core'
import { lists } from './Schema/Schema';

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./db/classtrack.db',
  },
  lists,
  //session,
});