import Container from '../Container';
import styles from './style.module.css';
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Button from '../Button';

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const fields = node.data.target.fields;
      console.log("EMbedded ENTRY!", {node, fields});
      return <Button url={fields.url} text={fields.buttonText} primary={fields.primary} />
    },

    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      
        console.log("EMbedded Asset!", {node});
      return <img />
    }
  }
};

const HeroBanner = (props) => {
    const { path, fields } = props;

    const heroImageStyle = {
        backgroundImage: `url(https:${fields?.image?.fields?.file?.url})`
    };

    console.log("Hero fields", {fields, BLOCKS: BLOCKS.EMBEDDED_ENTRY});

    return (
        <section
            className={styles.hero}
            data-sb-field-path={` ${path} ${path}.image`}
            style={heroImageStyle}
        >
            <Container isSection={false} classes={styles[fields.textColor]}>
                {fields.title && <h1 data-sb-field-path=".title" className={styles.hero__title}>{fields.title}</h1>}
                {fields.subtitle && <p data-sb-field-path=".subtitle" className={styles.hero__subtitle}>{fields.subtitle}</p>}
                {fields.test && <div data-sb-field-path=".test">{documentToReactComponents(fields.test, options)}</div>}
            </Container>
        </section>
    );
};

export default HeroBanner;
