const pad = (str: string, size: number, _opts?: { char?: string; left?: boolean }) => {
  const opts = Object.assign({ char: " ", left: false }, _opts);
  let pad = "";
  for (let i = 0; i < size; i++) pad += opts.char;

  if (opts.left) return (pad + str).slice(-size);
  else return (str + pad).substring(0, size);
};

export default {
  Padding: pad,
};
