"use client";

import useFollowerInfo from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <p>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </p>
  );
};

export default FollowerCount;
