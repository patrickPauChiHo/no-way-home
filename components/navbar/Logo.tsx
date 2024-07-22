import { Button } from "../ui/button";
import Link from "next/link";
import { GiGoblinCamp } from "react-icons/gi";

function Logo() {
  return (
    <Button asChild size="icon">
      <Link href="/">
        <GiGoblinCamp className="w-6 h-6" />
      </Link>
    </Button>
  );
}

export default Logo;
