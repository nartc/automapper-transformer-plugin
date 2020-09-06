export const inheritanceText = `
export class BaseEntity {
  readonly id!: string;
  readonly createDate!: Date;
  readonly updateDate!: Date;
  readonly deleteDate?: Date;
  readonly version!: number;
}

export class ResponseBaseEntity {
  id!: string;
}

export class User extends BaseEntity {
  displayName!: string;
  email!: string;
  emailVerified!: boolean;
  photoURL!: string;
}

export class ResponseUserDto extends ResponseBaseEntity {
  displayName!: string;
  email!: string;
  emailVerified!: boolean;
  photoURL!: string;
}
`;

export const inheritanceTranspiledText = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUserDto = exports.User = exports.ResponseBaseEntity = exports.BaseEntity = void 0;
class BaseEntity {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { id: () => String, createDate: () => Date, updateDate: () => Date, deleteDate: () => Date, version: () => Number };
    }
}
exports.BaseEntity = BaseEntity;
class ResponseBaseEntity {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { id: () => String };
    }
}
exports.ResponseBaseEntity = ResponseBaseEntity;
class User extends BaseEntity {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { displayName: () => String, email: () => String, emailVerified: () => Boolean, photoURL: () => String };
    }
}
exports.User = User;
class ResponseUserDto extends ResponseBaseEntity {
    static __NARTC_AUTOMAPPER_METADATA_FACTORY() {
        return { displayName: () => String, email: () => String, emailVerified: () => Boolean, photoURL: () => String };
    }
}
exports.ResponseUserDto = ResponseUserDto;
`;
