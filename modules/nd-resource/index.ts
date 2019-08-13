import Resource from "./models/Resource";
import Package from "./package.json";

// ----------------------- //
// Write resource to file  //
// ----------------------- //

// const fileManager = new FileManager.write("/tmp/directory");

// const resource = new Resource.Novel(new Novel(123456));
// resource.write(fileManager)

// await fileManager.run()

// ----------------------- //
// Load resource from file //
// ----------------------- //

// const resource = new Resource.File(fileManager.system.directory);
// const novel = new Novel.Resource(resource)

export { Resource, Package };
export { RESOURCE_FILENAME } from "./constants/index";
