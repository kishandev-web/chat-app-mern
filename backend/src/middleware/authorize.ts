export const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user.role?.name;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};
