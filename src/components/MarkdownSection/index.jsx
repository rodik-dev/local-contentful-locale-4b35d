import ReactMarkdown from 'react-markdown';
import Container from '../Container';

const MarkdownSection = (props) => {
    return (
        <Container data-sb-field-path={props.path}>
            <div data-sb-field-path=".markdown">
                {props.fields.markdown && (
                <ReactMarkdown>
                    {props.fields.markdown}
                </ReactMarkdown>
                )}
                {props.fields.rich && (
                
                )}
                
            </div>
        </Container>
    );
};

export default MarkdownSection;
