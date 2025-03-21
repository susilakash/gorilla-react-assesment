import React from 'react'

const Table = ({ usersData }) => {
    return (
        <table className='user-table'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {usersData?.length > 0 && usersData?.map((user) => {
                    return (<tr key={user?.id}>
                        <td>{user?.name}</td>
                        <td>{user?.id}</td>
                        <td>{user?.email}</td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default Table
