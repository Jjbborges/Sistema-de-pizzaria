export interface Admin {
    usuario: string;
    senha: string;
}
export declare function listarAdmins(): Admin[];
export declare function hashSenha(senha: string): string;
export declare function autenticarAdmin(usuario: string, senha: string): boolean;
export declare function cadastrarAdmin(usuario: string, senha: string): boolean;
//# sourceMappingURL=adminService.d.ts.map