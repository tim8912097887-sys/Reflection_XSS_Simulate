import { RequestHandler } from "express";

export default class ReflectInputController {
  constructor() {}

  reflectInput: RequestHandler = async (req, res) => {
    const query = req.query.q; // Just extracting from 'q'
    // DANGER: Sending 'query' directly back into the HTML
    res.send(`<h1>Search results for: ${query}</h1>`);
  };
}
