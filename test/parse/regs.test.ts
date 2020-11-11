
import { REG_ATTR, REG_CDATA_SECT, REG_COMMENTS, REG_DOCTYPE, REG_END_TAG, REG_START_TAG, REG_XML_DECL } from '../../src/parse/regs';

test('XML Declare Reg', () => {
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0"?>')).toBeTruthy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml     version=\'1.1\'      ?>')).toBeTruthy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('< ?xml version="1.0"?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0"? >')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version=" 1.0 "?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version=1.0?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<? xml version="1.0"?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="0.1"?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?XML version="1.0"?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version=""?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8"?>')).toBeTruthy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0" standalone="yes"?>')).toBeTruthy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0" standalone="not"?>')).toBeFalsy();
	REG_XML_DECL.lastIndex = 0;
	expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8" standalone="no"?>')).toBeTruthy();
});

test('CDATA Reg', () => {
	REG_CDATA_SECT.lastIndex = 0;
	expect(REG_CDATA_SECT.test('<![CDATA[]]>')).toBeTruthy();
	REG_CDATA_SECT.lastIndex = 0;
	expect(REG_CDATA_SECT.test('<![CDATA[Anything 123]]>')).toBeTruthy();
	REG_CDATA_SECT.lastIndex = 0;
	expect(REG_CDATA_SECT.test(`<![CDATA[
		Anything with return
	]]>`)).toBeTruthy();
	REG_CDATA_SECT.lastIndex = 0;
	expect(REG_CDATA_SECT.test('<![cdata[]]>')).toBeFalsy();
	REG_CDATA_SECT.lastIndex = 0;
	expect(REG_CDATA_SECT.test('<![ CDATA [] ]>')).toBeFalsy();
});

test('DocType Reg', () => {
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test('<!DOCTYPE>')).toBeFalsy();
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test('<!DOCTYPE >')).toBeFalsy();
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test(`<!DOCTYPE test
		Anything 123
	>`)).toBeTruthy();
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test('<!DOCTYPE "anyt\'hing" \'anyt"hing\' <![CDATA[Any Thing]]>>')).toBeTruthy();
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test('<!DOCTYPE "aaa \'123>')).toBeFalsy();
	REG_DOCTYPE.lastIndex = 0;
	expect(REG_DOCTYPE.test('<!DOCTYPE <bbb>')).toBeFalsy();
});

test('Comments Reg', () => {
	REG_COMMENTS.lastIndex = 0;
	expect(REG_COMMENTS.test('<!--->')).toBeFalsy();
	REG_COMMENTS.lastIndex = 0;
	expect(REG_COMMENTS.test('<!---->')).toBeTruthy();
	REG_COMMENTS.lastIndex = 0;
	expect(REG_COMMENTS.test('<!--------- -------->')).toBeTruthy();
	REG_COMMENTS.lastIndex = 0;
	expect(REG_COMMENTS.test(`<!-- test
		Anything 123
	-->`)).toBeTruthy();
});

test('Start Tag Reg', () => {
	REG_START_TAG.lastIndex = 0;
	expect(REG_START_TAG.test('<a>')).toBeTruthy();
	REG_START_TAG.lastIndex = 0;
	expect(REG_START_TAG.test('< a>')).toBeFalsy();
	REG_START_TAG.lastIndex = 0;
	expect(REG_START_TAG.test('<1a>')).toBeFalsy();
	REG_START_TAG.lastIndex = 0;
	expect(REG_START_TAG.test(`<a123     
	 b
	 =
	 "
	 2
	 "
	  c
	  =
	  '
	  3
	  '
		 >`)).toBeTruthy();
});

test('End Tag Reg', () => {
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test('</a>')).toBeTruthy();
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test(`</a        
	
	>`)).toBeTruthy();
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test('< /a>')).toBeFalsy();
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test('</ a>')).toBeFalsy();
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test('</1a>')).toBeFalsy();
	REG_END_TAG.lastIndex = 0;
	expect(REG_END_TAG.test('</a b>')).toBeFalsy();
});

test('Attribute Reg', () => {
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a="b"')).toBeTruthy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a="&"')).toBeFalsy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a=""')).toBeTruthy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a="<"')).toBeFalsy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test(`a  =  '
	b
	'   `)).toBeTruthy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('1a="b"')).toBeFalsy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a="&nbsp;"')).toBeTruthy();
	REG_ATTR.lastIndex = 0;
	expect(REG_ATTR.test('a="&#xAbc123;"')).toBeTruthy();
});
