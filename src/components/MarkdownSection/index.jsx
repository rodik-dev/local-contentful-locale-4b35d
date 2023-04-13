import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ReactMarkdown from 'react-markdown';
import Container from '../Container';
import Button from '../Button';
import Card from '../Card';

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const fields = node.data.target.fields;
      const sys = node.data.target.sys;
      const contentType = sys.contentType.sys.id
      console.log("EMbedded ENTRY!", {node, fields});
      if (contentType === "Button") {
        return <Button url={fields.url} text={fields.buttonText} primary={fields.primary} data-sb-object-id={sys.id} data-sb-field-path=".buttonText" />
      } else if (contentType === "Card") {
          return <div style={{width: "350px"}}><Card {...fields} data-sb-object-id={sys.id}></Card></div>
      }
    },

    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fields = node.data.target.fields;
        console.log("EMbedded Asset!", {node});
      return <img src={fields.file.url} />
    }
  }
};

const MarkdownSection = (props) => {
    return (
        <Container data-sb-field-path={props.path}>
            {props.fields.markdown && (
            <div data-sb-field-path=".markdown">
                <ReactMarkdown>
                    {props.fields.markdown}
                </ReactMarkdown>  
            </div>
            )}
            {props.fields.rich && 
            <div data-sb-field-path=".rich">
                {documentToReactComponents(props.fields.rich, options)}
            </div>}
        </Container>
    );
};

export default MarkdownSection;
