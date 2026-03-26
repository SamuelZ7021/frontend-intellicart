import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';


const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]: 'frontend-intellicart',
    }),
    spanProcessors: [
        new BatchSpanProcessor(exporter),
    ],
});
provider.register({
    contextManager: new ZoneContextManager(),
});

registerInstrumentations({
    instrumentations: [
        getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-xml-http-request': {
                propagateTraceHeaderCorsUrls: [/.*/], // Propagar headers a todos los dominios del proyecto
            },
            '@opentelemetry/instrumentation-fetch': {
                propagateTraceHeaderCorsUrls: [/.*/],
            },
        }),
    ],
});

export const tracer = provider.getTracer('frontend-tracer');
