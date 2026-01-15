import { UserForm } from '../_components/user-form';

export default function NewUserPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administración de Usuarios</h1>
        <p className="text-muted-foreground">Registra un nuevo usuario en el sistema.</p>
      </div>
      <UserForm />
    </div>
  );
}
