export const userModelText = `
class Address {
  street: string;
}

class Profile {
  bio: string;
  age: string;
}

export class User {
  firstName: string;
  lastName: string;
  profile: Profile;
  addresses: Address[];
}
`;

export const userModelTranspiledText = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { street: null };
    }
}
class Profile {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { bio: null, age: null };
    }
}
class User {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { firstName: null, lastName: null, profile: Profile, addresses: Address };
    }
}
exports.User = User;
`;
