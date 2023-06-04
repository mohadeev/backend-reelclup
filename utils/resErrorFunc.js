const resErrorFunc = async (res, errorMessage) => {
  res.json({ errorMessage: errorMessage });
};

export default resErrorFunc;
//some changes
