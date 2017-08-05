/**
 * clean req.body from data that never must be created/updated
 */
export function cleanBody(body) {
  delete body._id;
  //delete body.id;
  delete body.__v;

  delete body.create_at;
  delete body.updated_at;
}
