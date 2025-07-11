import { EnvConfig } from "../config/env";
import {
  Role,
  type IAuthProvider,
  type IUser,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: EnvConfig.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdminExist) {
      return;
    }

    const hashedPass = await bcrypt.hash(
      EnvConfig.SUPER_ADMIN_PASS,
      Number(EnvConfig.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: EnvConfig.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: EnvConfig.SUPER_ADMIN_NAME,
      email: EnvConfig.SUPER_ADMIN_EMAIL,
      password: hashedPass,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const superAdmin = await User.create(payload);
  } catch (error) {
    console.log("Error creating SuperAdmin", error);
  }
};
