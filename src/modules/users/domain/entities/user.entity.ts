export class User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  isValidated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: Date | null;

  constructor(user?: Partial<User>) {
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.email = user.email;
      this.password = user.password;
      this.isValidated = user.isValidated;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
      this.deleted = user.deleted;
    }
  }

  /**
   * Método estático para crear un usuario con los campos requeridos
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @param username - Nombre de usuario
   * @returns Nueva instancia de User con los campos requeridos
   */
  static create(email: string, password: string, username: string): User {
    return new User({
      email,
      password,
      username,
      isValidated: false,
    });
  }
}
