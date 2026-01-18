import { Link } from "react-router-dom";
import { getUserDetailUrl } from "@/utils/adminNavigation";

interface UserEmailLinkProps {
  userId: string;
  email: string;
}

const UserEmailLink = ({ userId, email }: UserEmailLinkProps) => {
  return (
    <Link
      to={getUserDetailUrl(userId)}
      className="text-primary hover:underline font-medium"
    >
      {email}
    </Link>
  );
};

export default UserEmailLink;
