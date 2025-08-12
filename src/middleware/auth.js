import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({message: "Acceso Denegado!"});

  try {
    const verified = jwt.verify(token, "secret_key");
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ messgae: "Token invalido" });
  }
}