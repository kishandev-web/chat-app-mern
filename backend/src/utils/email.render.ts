import ejs from "ejs";
import path from "path"


const renderEmailTemplate = async (templateName:string, data:any) => {
  const filePath = path.join(
    __dirname,
    `../emails/templates/${templateName}.ejs`,
  );

  return await ejs.renderFile(filePath, data);
};


export default renderEmailTemplate;
