const User = require("../models/User");

describe("User Model", () => {
  it("should have correct schema definition", () => {
    const schema = User.schema.obj;
    
    expect(schema.name.name || schema.name).toBe("String");
    
    expect(schema.email.type.name || schema.email.type).toBe("String");
    expect(schema.email.unique).toBe(true);
    
    expect(schema.password.name || schema.password).toBe("String");
  });
});
