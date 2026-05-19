import React, { useEffect } from 'react'
import { motion } from "motion/react"
import ComplexityGraph from './ComplexityGraph';

function InfoTab({ algo }) {
useEffect(()=>{
// console.log("algo in info tab: ", algo)
},[])
    if (!algo) {
        return <div className="text-gray-400 text-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold mb-6
                bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent"
            >
                {algo.title}
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 flex flex-col gap-8">

                    <section className="relative pl-4 border-l-2 border-emerald-500/40">
                        <h2 className="text-lg font-semibold text-emerald-400 mb-2">
                            Overview
                        </h2>

                        <p className="text-gray-300 leading-relaxed">
                            {algo.theory?.description || "No description available"}
                        </p>
                    </section>

                    {algo.keyPoints?.length > 0 && (
                        <section className="flex flex-wrap gap-2">
                            {algo.keyPoints.map((point, i) => (
                                <motion.span
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-2 text-sm rounded-full
                                    bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                                    text-white-300/80 border border-indigo-400/20"
                                >
                                    {point}
                                </motion.span>
                            ))}
                        </section>
                    )}

                    {/* COMPLEXITY */}
                    <section className="mt-2">
                        <h2 className="text-lg font-semibold text-emerald-400 mb-3">
                            Complexity
                        </h2>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                            <ComplexityGraph
                                complexity={algo.complexity || {
                                    time: algo.theory?.timeComplexity,
                                    space: algo.theory?.spaceComplexity
                                }}
                            />
                        </div>
                    </section>

                </div>

                <div className="flex flex-col gap-6">

                    {/* PROS / CONS */}
                    <div className="space-y-4">

                        {(algo.pros?.length > 0 || algo.cons?.length > 0) && (
                            <h2 className="text-sm uppercase tracking-wide text-gray-400">
                                Insights
                            </h2>
                        )}

                        <div className="flex flex-col gap-2 font-medium">

                            {algo.pros?.map((p, i) => (
                                <div key={i} className="flex items-start gap-2 text-green-400">
                                    <span>+</span> {p}
                                </div>
                            ))}

                            {algo.cons?.map((c, i) => (
                                <div key={i} className="flex items-start gap-2 text-red-400">
                                    <span>−</span> {c}
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className=" uppercase tracking-wide text-gray-400">
                            Pseudocode
                        </h2>

                        <div className="bg-black/70 border border-white/10 rounded-xl p-4 font-mono text-sm">

                            {algo?.pseudocode?.lines?.map((line, i) => (
                                <div
                                    key={i}
                                    className={`
                                        px-2 py-1 rounded transition
                                        ${i === algo?.pseudocode?.activeLine
                                            ? "bg-amber-500/20 text-amber-300"
                                            : "text-gray-400"}
                                    `}
                                >
                                    <span className="opacity-40 mr-2">{i + 1}</span>
                                    {line}
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default InfoTab;