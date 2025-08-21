/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns3Parser from './parsers/columns3.js';
import columns4Parser from './parsers/columns4.js';
import cards1Parser from './parsers/cards1.js';
import columns9Parser from './parsers/columns9.js';
import columns13Parser from './parsers/columns13.js';
import columns11Parser from './parsers/columns11.js';
import cards14Parser from './parsers/cards14.js';
import columns15Parser from './parsers/columns15.js';
import tableNoHeader8Parser from './parsers/tableNoHeader8.js';
import columns21Parser from './parsers/columns21.js';
import columns10Parser from './parsers/columns10.js';
import columns22Parser from './parsers/columns22.js';
import hero23Parser from './parsers/hero23.js';
import hero25Parser from './parsers/hero25.js';
import cards19Parser from './parsers/cards19.js';
import tableStriped12Parser from './parsers/tableStriped12.js';
import cards27Parser from './parsers/cards27.js';
import columns5Parser from './parsers/columns5.js';
import columns7Parser from './parsers/columns7.js';
import columns31Parser from './parsers/columns31.js';
import cards33Parser from './parsers/cards33.js';
import cards32Parser from './parsers/cards32.js';
import cardsNoImages35Parser from './parsers/cardsNoImages35.js';
import cards24Parser from './parsers/cards24.js';
import cards29Parser from './parsers/cards29.js';
import columns38Parser from './parsers/columns38.js';
import cardsNoImages30Parser from './parsers/cardsNoImages30.js';
import columns17Parser from './parsers/columns17.js';
import cards36Parser from './parsers/cards36.js';
import cardsNoImages34Parser from './parsers/cardsNoImages34.js';
import columns40Parser from './parsers/columns40.js';
import columns43Parser from './parsers/columns43.js';
import cards39Parser from './parsers/cards39.js';
import hero46Parser from './parsers/hero46.js';
import cardsNoImages37Parser from './parsers/cardsNoImages37.js';
import columns41Parser from './parsers/columns41.js';
import cards20Parser from './parsers/cards20.js';
import cards49Parser from './parsers/cards49.js';
import columns50Parser from './parsers/columns50.js';
import hero51Parser from './parsers/hero51.js';
import columns52Parser from './parsers/columns52.js';
import columns45Parser from './parsers/columns45.js';
import columns53Parser from './parsers/columns53.js';
import cardsNoImages56Parser from './parsers/cardsNoImages56.js';
import columns54Parser from './parsers/columns54.js';
import tableStriped48Parser from './parsers/tableStriped48.js';
import columns47Parser from './parsers/columns47.js';
import columns59Parser from './parsers/columns59.js';
import cards58Parser from './parsers/cards58.js';
import columns57Parser from './parsers/columns57.js';
import columns62Parser from './parsers/columns62.js';
import carousel44Parser from './parsers/carousel44.js';
import columns26Parser from './parsers/columns26.js';
import columns63Parser from './parsers/columns63.js';
import hero65Parser from './parsers/hero65.js';
import columns66Parser from './parsers/columns66.js';
import cards42Parser from './parsers/cards42.js';
import cards61Parser from './parsers/cards61.js';
import columns67Parser from './parsers/columns67.js';
import columns68Parser from './parsers/columns68.js';
import carousel72Parser from './parsers/carousel72.js';
import cards73Parser from './parsers/cards73.js';
import columns70Parser from './parsers/columns70.js';
import columns6Parser from './parsers/columns6.js';
import columns60Parser from './parsers/columns60.js';
import hero77Parser from './parsers/hero77.js';
import columns76Parser from './parsers/columns76.js';
import columns71Parser from './parsers/columns71.js';
import cards69Parser from './parsers/cards69.js';
import columns75Parser from './parsers/columns75.js';
import cardsNoImages64Parser from './parsers/cardsNoImages64.js';
import accordion2Parser from './parsers/accordion2.js';
import cards55Parser from './parsers/cards55.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns3: columns3Parser,
  columns4: columns4Parser,
  cards1: cards1Parser,
  columns9: columns9Parser,
  columns13: columns13Parser,
  columns11: columns11Parser,
  cards14: cards14Parser,
  columns15: columns15Parser,
  tableNoHeader8: tableNoHeader8Parser,
  columns21: columns21Parser,
  columns10: columns10Parser,
  columns22: columns22Parser,
  hero23: hero23Parser,
  hero25: hero25Parser,
  cards19: cards19Parser,
  tableStriped12: tableStriped12Parser,
  cards27: cards27Parser,
  columns5: columns5Parser,
  columns7: columns7Parser,
  columns31: columns31Parser,
  cards33: cards33Parser,
  cards32: cards32Parser,
  cardsNoImages35: cardsNoImages35Parser,
  cards24: cards24Parser,
  cards29: cards29Parser,
  columns38: columns38Parser,
  cardsNoImages30: cardsNoImages30Parser,
  columns17: columns17Parser,
  cards36: cards36Parser,
  cardsNoImages34: cardsNoImages34Parser,
  columns40: columns40Parser,
  columns43: columns43Parser,
  cards39: cards39Parser,
  hero46: hero46Parser,
  cardsNoImages37: cardsNoImages37Parser,
  columns41: columns41Parser,
  cards20: cards20Parser,
  cards49: cards49Parser,
  columns50: columns50Parser,
  hero51: hero51Parser,
  columns52: columns52Parser,
  columns45: columns45Parser,
  columns53: columns53Parser,
  cardsNoImages56: cardsNoImages56Parser,
  columns54: columns54Parser,
  tableStriped48: tableStriped48Parser,
  columns47: columns47Parser,
  columns59: columns59Parser,
  cards58: cards58Parser,
  columns57: columns57Parser,
  columns62: columns62Parser,
  carousel44: carousel44Parser,
  columns26: columns26Parser,
  columns63: columns63Parser,
  hero65: hero65Parser,
  columns66: columns66Parser,
  cards42: cards42Parser,
  cards61: cards61Parser,
  columns67: columns67Parser,
  columns68: columns68Parser,
  carousel72: carousel72Parser,
  cards73: cards73Parser,
  columns70: columns70Parser,
  columns6: columns6Parser,
  columns60: columns60Parser,
  hero77: hero77Parser,
  columns76: columns76Parser,
  columns71: columns71Parser,
  cards69: cards69Parser,
  columns75: columns75Parser,
  cardsNoImages64: cardsNoImages64Parser,
  accordion2: accordion2Parser,
  cards55: cards55Parser,
  ...customParsers,
};

const transformers = {
  cleanup: cleanupTransformer,
  images: imageTransformer,
  links: linkTransformer,
  sections: sectionsTransformer,
  ...customTransformers,
};

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    Object.values(transformers).forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }));

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // transform all elements using parsers
  [...defaultContentElements, ...blockElements, ...pageElements]
    // sort elements by order in the page
    .sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
    // filter out fragment elements
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        // parse the element
        if (parserFn) {
          parserFn.call(this, parserElement, { ...source });
        }
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (source) => {
    const { document, params: { originalURL } } = source;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...source, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...source, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...source, inventory });
      path = generateDocumentPath(source, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...source, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
