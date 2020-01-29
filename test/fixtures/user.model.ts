export const userModelText = `
class Profile {
  bio: string;
  age: string;
}

export class User {
  firstName: string;
  lastName: string;
  profile: Profile;
}
`;

export const userModelTranspiledText = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __nartc__automapper = require("@nartc/automapper");
class Profile {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { bio: null, age: null };
    }
}
class User {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { firstName: null, lastName: null, profile: Profile };
    }
}
exports.User = User;
`;
