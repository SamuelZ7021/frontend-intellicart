import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

export const initObservability = () => {
    try {
        const provider = new WebTracerProvider({
            spanProcessors: [
                new SimpleSpanProcessor(new ConsoleSpanExporter())
            ]
        });

        provider.register({
            contextManager: new ZoneContextManager(),
        });

        registerInstrumentations({
            instrumentations: [
                new DocumentLoadInstrumentation(),
            ],
        });

        console.log('Observability initialized');
    } catch (e) {
        console.warn('Failed to initialize Observability:', e);
    }
};
