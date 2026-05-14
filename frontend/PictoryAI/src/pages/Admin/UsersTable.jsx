import '../../css/admincss/User.css';

export default function UsersTable({ users, searchQuery = '' }) {
  const query = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    return [
      user.name,
      user.email,
      user.storeName,
      user.businessType,
      user.plan,
    
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="usersTableWrap">
      <table className="usersTable">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Store</th>
            <th>Business Type</th>
            <th>Plan</th>
           
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="userCell">
                  <span className="userAvatar">{user.name.charAt(0)}</span>
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.storeName}</td>
              <td>{user.businessType}</td>
              <td>
                <span className={`planBadge ${user.plan.toLowerCase()}`}>
                  {user.plan}
                </span>
              </td>
             
              <td>{user.joinedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div className="emptyUsers">No users found</div>
      )}
    </div>
  );
}
