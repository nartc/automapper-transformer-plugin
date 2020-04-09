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
  otherAddresses: Array<Address>;
  flag: boolean;
  foo: any;
  nullable: string | null;
  primitives: string[];
  nullableType: Address | null;
  maybePrimitives?: string[];
  nullablePrimitives: string[] | null;
  maybeType?: Address;
}
`;

export const userModelTextStrict = `
class Address {
  street!: string;
}

class Profile {
  bio!: string;
  age!: string;
}

export class User {
  firstName!: string;
  lastName!: string;
  profile!: Profile;
  addresses!: Address[];
  otherAddresses!: Array<Address>;
  flag!: boolean;
  foo!: any;
  nullable!: string | null;
  primitives!: string[];
  nullableType!: Address | null;
  maybePrimitives?: string[];
  nullablePrimitives!: string[] | null;
  maybeType?: Address;
}
`;

export const userModelTranspiledText = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { street: () => String };
    }
}
class Profile {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { bio: () => String, age: () => String };
    }
}
class User {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { firstName: () => String, lastName: () => String, profile: () => Profile, addresses: () => Address, otherAddresses: () => Address, flag: () => Boolean, foo: null, nullable: () => String, primitives: () => [String], nullableType: () => Address, maybePrimitives: () => [String], nullablePrimitives: () => [String], maybeType: () => Address };
    }
}
exports.User = User;
`;
