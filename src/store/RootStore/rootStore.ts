import ApiStore from "@apiStore";

export default class RootStore {
  readonly apiStore = new ApiStore("https://api.github.com/");
}
