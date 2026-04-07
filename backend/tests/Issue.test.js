const Issue = require("../models/Issue");
const mongoose = require("mongoose");

describe("Issue Model", () => {
  it("should have correct schema definition", () => {
    const schema = Issue.schema.obj;
    
    expect(schema.title.name || schema.title).toBe("String");
    expect(schema.description.name || schema.description).toBe("String");
    
    expect(schema.status.type.name || schema.status.type).toBe("String");
    expect(schema.status.enum).toEqual(["Backlog", "Ready", "In Progress", "In Review", "Done"]);
    expect(schema.status.default).toBe("Backlog");
    
    expect(schema.projectId.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.projectId.ref).toBe("Project");
  });
});
