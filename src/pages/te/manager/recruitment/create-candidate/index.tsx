import { ROLE_USER } from "@/global/enum";
import ContainerPage from "@/layouts/containerPage/containerPage";
import CreatePage from "@/utils/hocs/ProviderPage";

const CreateCandidate = CreatePage('ManagerRecruitment/CreateCandidate', ROLE_USER.TE, ContainerPage);
export default CreateCandidate;