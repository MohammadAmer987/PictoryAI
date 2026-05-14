import '../../css/admincss/User.css';
import UsersTable from './UsersTable';
import { users } from './mockData';

export default function Users({ searchQuery }) {
  return (
    <div className="usersPage">
      <UsersTable users={users} searchQuery={searchQuery} />
    </div>
  );
}
