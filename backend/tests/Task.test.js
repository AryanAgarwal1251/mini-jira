const Task = require("../models/Task");
const mongoose = require("mongoose");

describe("Task Model", () => {
  it("should have correct schema definition", () => {
    const schema = Task.schema.obj;
    
    expect(schema.title.name || schema.title).toBe("String");
    expect(schema.description.name || schema.description).toBe("String");
    
    expect(schema.project.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.project.ref).toBe("Project");
    
    expect(schema.assignedTo.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.assignedTo.ref).toBe("User");
    
    expect(schema.status.type.name || schema.status.type).toBe("String");
    expect(schema.status.enum).toEqual(["todo", "in-progress", "done"]);
    expect(schema.status.default).toBe("todo");
    
    expect(schema.createdBy.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.createdBy.ref).toBe("User");

    expect(schema.createdAt.type.name || schema.createdAt.type).toBe("Date");
    expect(schema.createdAt.default).toBe(Date.now);
  });
});
