import ReactMarkdown from 'react-markdown';
import Container from '../Container';

const MarkdownSection = (props) => {
    return (
        <Container data-sb-field-path={props.path}>
            {props.fields.markdown && (<div data-sb-field-path=".markdown">
                <ReactMarkdown>
                    {props.fields.markdown}
                </ReactMarkdown>  
            </div>
            )}
            <div data-sb-field-path=".rich">
                {props.fields.rich && documentToReactComponents(fields.test, options)}
            </div>
        </Container>
    );
};

export default MarkdownSection;
