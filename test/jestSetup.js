import EnzymeAdapter from "enzyme-adapter-react-16";
import { shallow, mount, configure } from "enzyme";

require("core-js"); //need babel for newer ES features on older node versions

configure({ adapter: new EnzymeAdapter() });

global.clearJestMocks = (...mocks) => {
	mocks.forEach((mock) => {
		if (mock) {
			if (mock.mockClear) {
				mock.mockClear();
			} else {
				global.clearJestMocks(...Object.values(mock));
			}
		}
	});
};

global.shallow = shallow;
global.mount = mount;

process.on("unhandledRejection", (err) => {
	console.log("!!!!!!!! TEST OR CODE DIDNT HANDLE REJECTION !!!!!!! ", err);
	process.exit(1);
});
