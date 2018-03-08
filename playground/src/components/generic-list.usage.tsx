import * as React from 'react';

import { IUser, User } from '@src/models';
import { GenericList } from '@src/components';

const users = [
  new User('Rosamonte', 'Especial'),
  new User('Aguantadora', 'Despalada'),
  new User('Taragui', 'Vitality'),
];

export class UserList extends GenericList<IUser> { }

export default () => (
  <UserList
    items={users}
    itemRenderer={(item) => <div key={item.id}>{item.fullName}</div>}
  />
);
