import Badge from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const upperStatus = status.toUpperCase();

  switch (upperStatus) {
    case "COMPLETED":
      return (
        <Badge variant="status" color="success">
          {upperStatus}
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="status" color="warning">
          {upperStatus}
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="status" color="error">
          {upperStatus}
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge variant="status" color="default">
          {upperStatus}
        </Badge>
      );
    default:
      return (
        <Badge variant="status" color="default">
          {upperStatus}
        </Badge>
      );
  }
}
