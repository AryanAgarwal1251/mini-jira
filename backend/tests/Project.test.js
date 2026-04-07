const Project = require("../models/Project");
const mongoose = require("mongoose");

describe("Project Model", () => {
  it("should have correct schema definition", () => {
    const schema = Project.schema.obj;
    
    expect(schema.name.type.name || schema.name.type).toBe("String");
    expect(schema.name.required).toBe(true);
    
    expect(schema.description.name || schema.description).toBe("String");
    
    expect(schema.createdBy.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.createdBy.ref).toBe("User");

    expect(schema.createdAt.type.name || schema.createdAt.type).toBe("Date");
    expect(schema.createdAt.default).toBe(Date.now);
  });
});
