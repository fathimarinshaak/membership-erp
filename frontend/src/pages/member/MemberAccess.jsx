import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "../../services/axios";

const MemberAccess = () => {
  const { token } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/auth/access/${token}`);
        setMember(data.member);
      } catch {
        setError("Link expired or invalid");
      }
    };

    verify();
  }, [token]);

  if (error) return <div>{error}</div>;
  if (!member) return <div>Verifying access...</div>;

  return (
    <div>
      <h1>Welcome {member.name}</h1>
      <p>Email: {member.email}</p>
    </div>
  );
};

export default MemberAccess;